const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const cheerio = require('cheerio');
const JobPosting = require('./models/JobPosting');
const Company = require('./models/Company');
const JobCategory = require('./models/JobCategory');
const Recruiter = require('./models/Recruiter');
const JobStatus = require('./models/JobStatus');
const User = require('./models/User'); 
const Application = require('./models/Application'); 
const Bookmark = require('./models/Bookmark');


dotenv.config();

// MongoDB 연결 설정
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// 딜레이 함수 (임의로 설정한 딜레이)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 통합된 크롤링 및 기술 스택 키워드
const techStackKeywords = [
    'python', 'java', 'javascript', 'node.js', 'react', 'vue', 'angular',
    'django', 'flask', 'spring', 'mysql', 'mongodb', 'docker', 'typescript', 'aws'
  ];
  
  // 크롤링 함수
  async function crawlSaramin(keyword, pages = 1) {
    const jobs = [];
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept-Language': 'ko-KR,ko;q=0.9',
      'Connection': 'keep-alive',
      'Accept-Encoding': 'gzip, deflate, br',
    };
  
    for (let page = 1; page <= pages; page++) {
      const url = `https://www.saramin.co.kr/zf_user/search/recruit?searchType=search&searchword=${keyword}&recruitPage=${page}`;
      console.log(`🔍 Fetching page ${page}: ${url}`);
  
      try {
        const response = await axios.get(url, { headers });
        const $ = cheerio.load(response.data);
  
        $('.item_recruit').each((_, el) => {
          try {
            const companyName = $(el).find('.corp_name a').text().trim();
            const jobTitle = $(el).find('.job_tit a').text().trim();
            const jobUrl = 'https://www.saramin.co.kr' + $(el).find('.job_tit a').attr('href');
            const conditions = $(el).find('.job_condition span');
            const location = conditions.eq(0).text().trim();
            const experience = conditions.eq(1).text().trim();
            const education = conditions.eq(2).text().trim();
            const employmentType = conditions.eq(3).text().trim();
            const jobCategory = $(el).find('.job_sector').text().trim();
            const salary = $(el).find('.salary_class_selector').text().trim();
            const deadlineText = $(el).find('.job_date .date').text().trim();
  
            // 마감일 변환 로직
            let deadline = null;
            if (deadlineText === '오늘마감') {
              deadline = new Date();
            } else if (deadlineText === '내일마감') {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              deadline = tomorrow;
            } else if (!['채용시', '상시채용'].includes(deadlineText)) {
              deadline = new Date(deadlineText);
            }
  
            // 키워드 기반 기술 스택 추출
            const techStack = techStackKeywords.filter((stack) => jobTitle.toLowerCase().includes(stack) || jobCategory.toLowerCase().includes(stack));
  
            jobs.push({
              companyName: companyName || 'Unknown Company',
              jobTitle: jobTitle || 'Unknown Title',
              jobUrl: jobUrl || 'No URL',
              location: location || 'Location Not Specified',
              experience: experience || 'Experience Not Specified',
              education: education || 'Education Not Specified',
              employmentType: employmentType || 'Employment Type Not Specified',
              jobCategory: jobCategory || 'Category Not Specified',
              salary: salary || 'Not Specified',
              techStack: techStack.length > 0 ? techStack : ['N/A'],
              deadline: deadline || null,
            });
          } catch (error) {
            console.error(`❌ Error parsing job posting: ${error.message}`);
          }
        });
  
        console.log(`✅ ${page} 페이지 크롤링 완료`);
      } catch (error) {
        console.error(`❌ Error fetching page ${page}: ${error.message}`);
      }
  
      await delay(2000); // 페이지 간 요청 간격
    }
  
    return jobs;
  }


// 회사 저장
async function saveCompanyToDB(companyName) {
    // 회사 저장
    let company = await Company.findOne({ name: companyName });
    if (!company) {
        company = await Company.create({
            name: companyName,
            industry: 'Unknown', // 기본값 설정
            website: '', // 기본값 설정
            location: 'Unknown', // 기본값 설정
        });
        console.log(`✅ New company saved: ${companyName}`);
    } else {
        console.log(`🔄 Existing company: ${companyName}`);
    }

    // Recruiter 저장
    let recruiter = await Recruiter.findOne({ company: company._id });
    if (!recruiter) {
        recruiter = await Recruiter.create({
            name: `${companyName} 담당자`, // 기본값 설정
            email: `${companyName.toLowerCase().replace(/\s+/g, '')}@example.com`,
            company: company._id,
        });
        console.log(`✅ New recruiter saved for company: ${companyName}`);
    }
    return company._id;
}


// 직무 분야 저장
async function saveJobCategoryToDB(categoryName) {
    if (!categoryName) return null;

    const existingCategory = await JobCategory.findOne({ name: categoryName });
    if (existingCategory) return existingCategory._id;

    const newCategory = await JobCategory.create({ name: categoryName });
    return newCategory._id;
}

// 채용 공고 상태 저장
async function saveJobStatus(jobPostingId, status = 'Open') {
    try {
        const jobStatus = await JobStatus.create({
            jobPosting: jobPostingId,
            status, // 'Open', 'Closed', 'Cancelled'
        });
        console.log(`✅ Job status saved for Job Posting ID: ${jobPostingId}`);
    } catch (error) {
        console.error(`❌ Error saving job status for Job Posting ID: ${jobPostingId}: ${error.message}`);
    }
}

// 채용 공고 저장
async function saveJobsToDB(jobs) {
    for (const job of jobs) {
        try {
            // 회사 저장
            const companyId = await saveCompanyToDB(job.companyName);

            // 직무 분야 저장
            const categoryId = await saveJobCategoryToDB(job.jobCategory);

            // 중복 확인
            const existingJob = await JobPosting.findOne({ url: job.jobUrl });
            if (existingJob) {
                console.log(`🔄 Skipping duplicate job: ${job.jobTitle}`);
                continue;
            }

            // 새 공고 저장
            const savedJob = await JobPosting.create({
                title: job.jobTitle,
                company: companyId,  // companyId를 `company` 필드에 전달
                categoryId,
                url: job.jobUrl,
                location: job.location,
                experience: job.experience,
                education: job.education,
                employmentType: job.employmentType,
                deadline: job.deadline,
            });
            // 채용 공고 상태 저장 (Open 상태로 기본 설정)
            await saveJobStatus(savedJob._id, 'Open');

            console.log(`✅ Saved job: ${job.jobTitle}`);
        } catch (error) {
            console.error(`❌ Error saving job to DB: ${error.message}`);
        }
    }
}

// 사용자 추가
async function addUserToDB(email, password) {
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(`🔄 Skipping existing user: ${email}`);
            return;
        }

        await User.create({ email, password });
        console.log(`✅ New user saved: ${email}`);
    } catch (error) {
        console.error(`❌ Error adding user: ${error.message}`);
    }
}
// 지원 내역 추가
async function addApplicationToDB(userId, jobId, status = 'Pending') {
    try {
        const existingApplication = await Application.findOne({ user: userId, job: jobId });
        if (existingApplication) {
            console.log(`🔄 Skipping existing application for job: ${jobId}`);
            return;
        }

        await Application.create({ user: userId, job: jobId, status });
        console.log(`✅ Application added for job: ${jobId}`);
    } catch (error) {
        console.error(`❌ Error adding application: ${error.message}`);
    }
}
// 북마크 추가
async function addBookmarkToDB(userId, jobId) {
    try {
        const existingBookmark = await Bookmark.findOne({ user: userId, job: jobId });
        if (existingBookmark) {
            console.log(`🔄 Skipping existing bookmark for job: ${jobId}`);
            return;
        }

        await Bookmark.create({ user: userId, job: jobId });
        console.log(`✅ Bookmark added for job: ${jobId}`);
    } catch (error) {
        console.error(`❌ Error adding bookmark: ${error.message}`);
    }
}
// 실행
(async () => {
    try {
      console.log('🚀 Starting crawl...');
      const pages = 3;
  
      for (const keyword of techStackKeywords) {
        console.log(`🔍 Crawling jobs for keyword: ${keyword}`);
        const jobs = await crawlSaramin(keyword, pages);
  
        console.log(`📄 Crawled ${jobs.length} jobs for keyword "${keyword}". Saving to MongoDB...`);
        await saveJobsToDB(jobs);
      }
  
      console.log('✅ Crawling and saving completed');
    } catch (error) {
      console.error(`❌ Error during crawling: ${error.message}`);
    } finally {
      mongoose.disconnect();
    }
  })();
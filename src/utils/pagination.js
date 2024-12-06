/**
 * 페이지네이션 계산 유틸 함수
 * @param {number} page - 현재 페이지 번호
 * @param {number} limit - 한 페이지당 항목 수
 * @returns {Object} - skip과 limit 설정값
 */
exports.getPagination = (page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    return {
      skip,
      limit: parseInt(limit, 10),
    };
  };
  
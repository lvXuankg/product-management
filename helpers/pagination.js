module.exports =  (objectPagination, query, countProducts) => {
    if(query.page &&!isNaN(query.page) && query.page > 0){
        objectPagination.currentPage = parseInt(query.page);
    }
    objectPagination.skip = (objectPagination.currentPage-1)*objectPagination.limitItems;

    const totalPage = Math.ceil(countProducts/objectPagination.limitItems);
    objectPagination.totalPage = totalPage;
    
    return objectPagination;
}
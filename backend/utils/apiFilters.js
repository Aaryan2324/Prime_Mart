class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  //searching based on keywords
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  //now filter products based on category , price etc.
  //also we dont need keyword anymore so we will remove it.
  filters() {
    const queryCopy = { ...this.queryStr };

    //Fields to remove
    const fieldsToRemove = ["keyword", "page"];
    fieldsToRemove.forEach((el) => delete queryCopy[el]);

    //Advance filter for price, ratings etc
    let queryStr = JSON.stringify(queryCopy);
    //put$$ sign before gt
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    // /g- global search
    // /b- search the entire line

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

export default APIFilters;

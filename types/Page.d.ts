type Page<T> = {
  content: T[];
  pageable: {
    page_number: number;
    page_size: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  total_pages: number;
  total_elements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  number_of_elements: number;
  empty: boolean;
};

type PageParams = {
  page?: number;
};

export type { Page, PageParams };

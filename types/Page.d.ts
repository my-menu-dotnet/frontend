type Page<T> = {
  content: T[];
  page: {
    number: number;
    size: number;
    total_elements: number;
    total_pages: number;
  }
};

type PageParams = {
  page?: number;
};

export type { Page, PageParams };

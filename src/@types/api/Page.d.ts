type Page<T> = {
  content: T[];
  page: {
    number: number;
    size: number;
    total_elements: number;
    total_pages: number;
  };
};

type PageParams<T> = {
  page?: number;
  // "[key],[asc|desc]"
  sort?:
    | keyof T
    | `${keyof T},${"asc" | "desc"}`
    | `${keyof T},${"desc" | "asc"}`[];
};

export type { Page, PageParams };

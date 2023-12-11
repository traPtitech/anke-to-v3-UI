import { useFetch, type AsyncData } from '#app';
import type { FetchError, FetchOptions } from 'ofetch';
import type {
  ExactPaths,
  HttpMethodsByPath,
  Methods,
  QueryParameters,
  RequestBody,
  ResponseData,
  ToPath,
  UrlPaths,
} from './api';

interface FetchOptionsWrap<
  PATH extends UrlPaths,
  METHOD extends Methods = HttpMethodsByPath<PATH>,
  REQUEST_BODY extends RequestBody = RequestBody<PATH, METHOD>,
  PARAMS extends QueryParameters = QueryParameters<PATH, METHOD>,
> extends Omit<FetchOptions, 'body'> {
  method: METHOD;
  body?: REQUEST_BODY;
  query?: PARAMS;
  params?: PARAMS;
  responseType?: ResponseType | 'json';
}

interface ResponseMap {
  blob: Blob;
  text: string;
  arrayBuffer: ArrayBuffer;
  stream: ReadableStream<Uint8Array>;
}

type ResponseType = keyof ResponseMap | undefined;

type NonNullable<T> = T extends null | undefined ? never : T;

interface FetchWrap {
  /**
   * call api
   */
  <RESPONSE_TYPE extends NonNullable<ResponseType>>(
    path: string,
    option: FetchOptions & { responseType: RESPONSE_TYPE },
  ): Promise<ResponseMap[RESPONSE_TYPE]>;

  /**
   * call api
   * @example
   * ```ts
   * const data = await $fetchApi('/pet/3')
   * // datga is type of Pet
   * ```
   */
  <
    EXACT_PATH extends ExactPaths,
    PATH extends ToPath<EXACT_PATH>,
    OPTION extends Omit<FetchOptionsWrap<PATH, 'get'>, 'method'>,
  >(
    path: EXACT_PATH,
    option?: Omit<OPTION, 'method'>,
  ): Promise<ResponseData<PATH, 'get'>>;

  /**
   * use vscode intellisense to keep path parameters like `/pet/{petId}`
   */
  <
    PATH extends UrlPaths,
    OPTION extends Omit<FetchOptionsWrap<PATH, 'get'>, 'method'>,
  >(
    path: PATH,
    option?: Omit<OPTION, 'method'>,
  ): Promise<ResponseData<PATH, 'get'>>;

  /**
   * call api
   * @example
   * ```ts
   * const data = await $fetchApi('/pet', { method: 'post', body: newPet })
   * // newPet is type of Pet
   * // data is type of Pet
   * ```
   */
  <
    EXACT_PATH extends ExactPaths,
    PATH extends ToPath<EXACT_PATH>,
    METHOD extends HttpMethodsByPath<PATH>,
    OPTION extends FetchOptionsWrap<PATH, METHOD>,
  >(
    path: EXACT_PATH,
    option: OPTION & { method: METHOD },
  ): Promise<ResponseData<PATH, METHOD>>;

  /**
   * use vscode intellisense to keep path parameters like `/pet/{petId}`
   */
  <
    PATH extends UrlPaths,
    METHOD extends HttpMethodsByPath<PATH>,
    OPTION extends FetchOptionsWrap<PATH, METHOD>,
  >(
    path: PATH,
    option: OPTION & { method: METHOD },
  ): Promise<ResponseData<PATH, METHOD>>;
}

export const $fetchApi: FetchWrap = $fetch;

interface UseFetchWrap {
  /**
   * call api
   */
  <RESPONSE_TYPE extends NonNullable<ResponseType>>(
    path: string,
    option: FetchOptions & { responseType: RESPONSE_TYPE },
  ): AsyncData<ResponseMap[RESPONSE_TYPE] | null, FetchError | null>;

  /**
   * call api
   * @example
   * ```ts
   * const { data, error } = await useFetchApi('/pet/3')
   * // datga is type of Pet
   * ```
   */
  <
    EXACT_PATH extends ExactPaths,
    PATH extends ToPath<EXACT_PATH>,
    OPTION extends Omit<FetchOptionsWrap<PATH, 'get'>, 'method'>,
    ERROR = FetchError,
  >(
    path: EXACT_PATH,
    option?: Omit<OPTION, 'method'>,
  ): AsyncData<ResponseData<PATH, 'get'> | null, ERROR | null>;

  /**
   * use vscode intellisense to keep path parameters like `/pet/{petId}`
   */
  <
    PATH extends UrlPaths,
    OPTION extends Omit<FetchOptionsWrap<PATH, 'get'>, 'method'>,
    ERROR = FetchError,
  >(
    path: PATH,
    option?: Omit<OPTION, 'method'>,
  ): AsyncData<ResponseData<PATH, 'get'> | null, ERROR | null>;

  /**
   * call api
   * @example
   * ```ts
   * const { data, error } = useFetchApi('/pet/3', { method: 'post', body: newPet })
   * // newPet is type of Pet
   * // data is type of Pet
   * ```
   */
  <
    EXACT_PATH extends ExactPaths,
    PATH extends ToPath<EXACT_PATH>,
    METHOD extends HttpMethodsByPath<PATH>,
    OPTION extends FetchOptionsWrap<PATH, METHOD>,
    ERROR = FetchError,
  >(
    path: EXACT_PATH,
    option: OPTION & { method: METHOD },
  ): AsyncData<ResponseData<PATH, METHOD> | null, ERROR | null>;

  /**
   * use vscode intellisense to keep path parameters like `/pet/{petId}`
   */
  <
    PATH extends UrlPaths,
    METHOD extends HttpMethodsByPath<PATH>,
    OPTION extends FetchOptionsWrap<PATH, METHOD>,
    ERROR = FetchError,
  >(
    path: PATH,
    option: OPTION & { method: METHOD },
  ): AsyncData<ResponseData<PATH, METHOD> | null, ERROR | null>;
}

export const useFetchAnkeToApi = useFetch as UseFetchWrap;

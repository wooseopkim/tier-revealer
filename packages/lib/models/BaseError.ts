export default interface BaseError extends Error {
  code: string;
  message: string;
}

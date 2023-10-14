export interface JwtPayload {
  readonly userId: string;
  readonly iss: string;
  readonly iat: number;
  readonly exp: number;
}

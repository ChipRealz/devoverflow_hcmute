export {};

declare global {
  interface ClerkAuthorization {
    permission: "";
    role: "org:admin" | "org:moderator";
  }
}

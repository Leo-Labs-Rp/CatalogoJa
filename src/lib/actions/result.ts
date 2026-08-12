export type ActionResult<T = undefined> =
  | { data?: T; error?: never; ok: true }
  | { data?: T; error: string; ok: false };

export function actionError(error: unknown, fallback: string): ActionResult<never> {
  if (error instanceof Error && error.message.includes("Sua sessão")) {
    return { error: error.message, ok: false };
  }

  return { error: fallback, ok: false };
}

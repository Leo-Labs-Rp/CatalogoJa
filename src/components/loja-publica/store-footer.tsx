import { MapPin } from "lucide-react";

import { InstagramIcon } from "@/components/icons/instagram-icon";
import { getInstagramProfileUrl, normalizeInstagramUsername } from "@/lib/instagram/username";

export type StoreFooterProps = {
  address: string | null;
  instagram: string | null;
  storeName: string;
};

export function StoreFooter({ address, instagram, storeName }: StoreFooterProps) {
  const instagramUsername = instagram ? normalizeInstagramUsername(instagram) : null;
  const instagramUrl = instagram ? getInstagramProfileUrl(instagram) : null;

  return (
    <footer className="mt-12 border-t border-[var(--cor-borda)]">
      <div className="mx-auto flex w-full max-w-[var(--content-width)] flex-col gap-3 px-4 py-8 text-sm text-[var(--cor-texto-suave)] @2xl/store:flex-row @2xl/store:items-center @2xl/store:justify-between @2xl/store:px-6 @5xl/store:px-8">
        <div>
          <p className="font-semibold text-[var(--cor-texto)]">{storeName}</p>
          {address ? (
            <p className="mt-1 flex items-start gap-1.5">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              {address}
            </p>
          ) : null}
        </div>

        {instagramUsername && instagramUrl ? (
          <a
            className="inline-flex min-h-11 items-center gap-2 font-medium text-[var(--cor-texto)] underline-offset-4 hover:underline"
            href={instagramUrl}
            rel="noreferrer"
            target="_blank"
          >
            <InstagramIcon className="size-4" />
            @{instagramUsername}
          </a>
        ) : null}
      </div>
    </footer>
  );
}

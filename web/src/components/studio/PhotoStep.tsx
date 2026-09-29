import { useRef, useState, type DragEvent } from "react";
import { ArrowRight, ImagePlus, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { preparePhoto, type PreparedPhoto } from "@/lib/image";
import type { Species } from "@/lib/api";
import { cn } from "@/lib/utils";

const tips = [
  "Une photo nette et lumineuse, de préférence à la lumière du jour.",
  "Le regard de votre compagnon bien visible, face ou trois-quarts.",
  "Un seul animal sur la photo, cadré assez près.",
];

export function PhotoStep({
  photo,
  species,
  onPhoto,
  onSpecies,
  onNext,
}: {
  photo: PreparedPhoto | null;
  species: Species;
  onPhoto: (photo: PreparedPhoto) => void;
  onSpecies: (species: Species) => void;
  onNext: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setLoading(true);
    try {
      onPhoto(await preparePhoto(file));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    void handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          className="sr-only"
          onChange={(e) => {
            void handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "group relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-card border border-dashed bg-surface transition-colors duration-300 sm:aspect-[5/4]",
            dragging ? "border-accent bg-accent/5" : "border-hairline-strong hover:border-ink/40",
          )}
        >
          {photo ? (
            <>
              <img
                src={photo.previewURL}
                alt="Votre photo"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-canvas/90 px-4 py-2 text-sm font-medium text-ink shadow-sm backdrop-blur">
                <RefreshCw className="h-4 w-4" />
                Changer de photo
              </span>
            </>
          ) : (
            <div className="flex flex-col items-center px-6 text-center">
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-ink-soft" />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-hairline bg-canvas transition-transform duration-500 group-hover:scale-105">
                  <ImagePlus className="h-6 w-6 text-ink-soft" strokeWidth={1.5} />
                </span>
              )}
              <p className="display mt-6 text-2xl">Déposez sa plus belle photo</p>
              <p className="mt-2 text-sm text-ink-soft">
                ou <span className="underline underline-offset-4">parcourez vos fichiers</span> · JPEG, PNG
              </p>
            </div>
          )}
        </button>
        {error && (
          <p role="alert" className="mt-4 text-sm text-[color:var(--color-chef)]">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col">
        <p className="eyebrow mb-4">Votre compagnon est</p>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              ["dog", "Un chien"],
              ["cat", "Un chat"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={species === value}
              onClick={() => onSpecies(value)}
              className={cn(
                "h-14 rounded-full border text-[0.95rem] font-medium transition-all duration-300",
                species === value
                  ? "border-ink bg-ink text-canvas"
                  : "border-hairline-strong text-ink hover:border-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="eyebrow mb-4 mt-10">Pour un portrait réussi</p>
        <ul className="space-y-4 border-t border-hairline pt-5">
          {tips.map((tip, i) => (
            <li key={tip} className="flex gap-4 text-sm text-ink-soft">
              <span className="display text-base text-accent">0{i + 1}</span>
              {tip}
            </li>
          ))}
        </ul>

        <Button size="lg" className="group mt-10 self-start" disabled={!photo} onClick={onNext}>
          Choisir le thème
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
        <p className="mt-4 text-xs text-ink-faint">
          Votre photo sert uniquement à créer le portrait et est supprimée sous 7 jours.
        </p>
      </div>
    </div>
  );
}

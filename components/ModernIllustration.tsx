import React from 'react';

const ModernIllustration = () => {
  return (
    <div className="relative mx-auto w-full max-w-2xl p-6">
      {/* Container principal avec animation */}
      <div className="bg-card/50 border-border animate-fade-in relative rounded-2xl border p-8 shadow-xl backdrop-blur-sm">
        {/* Titre */}
        <div className="mb-8 text-center">
          <h2 className="text-primary mb-2 text-2xl font-bold">
            Design Moderne
          </h2>
          <p className="text-muted-foreground">
            Illustration vectorielle avec palette shadcn
          </p>
        </div>

        {/* SVG Container avec effets */}
        <div className="bg-background border-border relative rounded-xl border p-6 shadow-lg">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 510 507"
            fill="none"
            className="mx-auto max-w-md transform transition-transform duration-300 hover:scale-105"
          >
            {/* Formes principales avec couleurs shadcn */}
            <path
              d="M232.28 457.68C345.128 457.68 436.61 366.198 436.61 253.35C436.61 140.502 345.128 49.02 232.28 49.02C119.432 49.02 27.95 140.502 27.95 253.35C27.95 366.198 119.432 457.68 232.28 457.68Z"
              className="fill-primary/80"
            />
            <path
              d="M377.49 401.67C450.143 401.67 509.04 342.773 509.04 270.12C509.04 197.467 450.143 138.57 377.49 138.57C304.837 138.57 245.94 197.467 245.94 270.12C245.94 342.773 304.837 401.67 377.49 401.67Z"
              className="fill-warning"
            />

            {/* Détails avec couleurs secondaires */}
            <path
              d="M392.77 317.39L355.39 390.71C358.402 377.142 360.583 363.403 361.92 349.57L391.79 286.57C392.37 296.06 392.76 306.45 392.77 317.39Z"
              className="fill-chart-2"
            />
            <path
              d="M351.18 406.3L392.72 324.82C392.27 354.24 388.91 386.77 379.26 415.59L338.95 433.52C343.88 426 347.9 416.71 351.18 406.3Z"
              className="fill-warning"
            />

            {/* Éléments décoratifs */}
            <path
              d="M391.51 249C396.57 287.14 405.98 394.35 363.51 455.65L363.26 456L265.39 506.71H263.11L261.11 505.71L258.91 504.58L161.15 454.17L160.9 453.84C153.495 442.923 147.561 431.077 143.25 418.61C143.15 418.29 143.04 417.97 142.94 417.66C131.99 386.46 128.53 350.71 128.31 319.03C128.31 318.73 128.31 318.43 128.31 318.14C128.25 304.75 128.76 292.14 129.53 280.88C129.519 280.774 129.519 280.666 129.53 280.56C130.38 268.04 131.53 257.29 132.59 249.2C132.59 248.86 132.67 248.53 132.71 248.2C133.91 238.96 134.91 233.45 134.96 233.2L135.14 232.2L202.54 213.62L207.68 212.19L225.84 159.27L204.92 140.56L220.47 96.85L208.56 76.65H205.25V25.65L256.25 8.81C256.085 8.44654 255.945 8.07236 255.83 7.69C255.6 6.85597 255.483 5.99508 255.48 5.13C255.473 4.26101 255.591 3.39556 255.83 2.56C256.093 1.62657 256.542 0.755867 257.15 0C257.749 0.756899 258.188 1.62793 258.44 2.56C258.685 3.39466 258.81 4.26008 258.81 5.13C258.811 5.99669 258.686 6.85893 258.44 7.69C258.325 8.07108 258.189 8.44506 258.03 8.81L311.25 25.62H311.37V76.62H307.99L296.08 96.82L311.64 140.52L292.11 158.71L310.28 211.71L310.73 211.83L315.9 213.29L362.59 226.52H362.87V226.62L389.25 234.01L389.44 235.01C389.49 235.28 390.35 240.11 391.44 248.29C391.46 248.53 391.47 248.76 391.51 249Z"
              className="fill-foreground/90"
            />

            {/* Points d'accent */}
            <path
              d="M345.51 250.9V275.48H320.93V250.9H345.51Z"
              className="fill-secondary"
            />
            <path
              d="M329.56 294.64V319.23H304.95V294.64H329.56Z"
              className="fill-secondary"
            />
            <path
              d="M270.56 402.5V377.91H245.98V402.5H270.56Z"
              className="fill-secondary"
            />

            {/* Cercle final avec couleur destructive */}
            <path
              d="M82.16 469.13C127.536 469.13 164.32 432.346 164.32 386.97C164.32 341.594 127.536 304.81 82.16 304.81C36.7843 304.81 0 341.594 0 386.97C0 432.346 36.7843 469.13 82.16 469.13Z"
              className="fill-destructive animate-pulse-glow"
            />
          </svg>
        </div>

        {/* Légende */}
        <div className="mt-6 text-center">
          <div className="text-muted-foreground inline-flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="bg-primary h-3 w-3 rounded-full"></div>
              <span>Primaire</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-warning h-3 w-3 rounded-full"></div>
              <span>Accent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-destructive h-3 w-3 rounded-full"></div>
              <span>Point focal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Effets de fond décoratifs */}
      <div className="bg-primary/10 absolute top-0 left-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"></div>
      <div className="bg-warning/10 absolute right-0 bottom-0 h-48 w-48 translate-x-1/2 translate-y-1/2 rounded-full blur-xl"></div>
    </div>
  );
};

export default ModernIllustration;

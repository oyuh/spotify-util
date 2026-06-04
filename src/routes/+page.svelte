<script>
  import '../app.css';

  const year = new Date().getFullYear();
</script>

<svelte:head>
  <title>jamlog</title>
</svelte:head>

<main class="min-h-dvh w-full flex items-center justify-center px-4 py-10">
  <div
    class="w-full max-w-xl rounded-xl border border-border bg-card text-card-foreground shadow-2xl shadow-black/40"
  >
    <!-- header -->
    <div class="flex items-center justify-between border-b border-border px-6 py-4">
      <span class="font-pixel text-lg tracking-tight">jamlog</span>
      <span class="inline-flex items-center gap-2 font-mono-ui text-xs text-muted-foreground">
        <span class="size-2 rounded-full bg-destructive animate-pulse"></span>
        offline
      </span>
    </div>

    <!-- body -->
    <div class="px-6 py-8 space-y-6">
      <div class="space-y-3">
        <h1 class="font-pixel text-3xl sm:text-4xl leading-tight">
          this site is paused.
        </h1>
        <p class="font-mono-ui text-sm leading-relaxed text-muted-foreground">
          jamlog in its current form is broken and I'm not patching it back up.
          Spotify keeps moving the goalposts for developers — deprecating
          endpoints, gating access, and generally making it miserable to build
          anything fun on their API. It's not worth fighting that here anymore.
        </p>
        <p class="font-mono-ui text-sm leading-relaxed text-muted-foreground">
          All of my focus has moved to
          <span class="text-foreground">fast.jamlog.lol</span> which is a cleaner,
          faster, far better project than this ever was. Go check that out
          instead.
        </p>
      </div>

      <!-- links -->
      <div class="flex flex-col sm:flex-row gap-3">
        <a
          href="https://lawsonhart.me/"
          class="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 font-mono-ui text-sm text-foreground transition-colors hover:bg-accent"
        >
          learn about me!
          <span class="transition-transform group-hover:translate-x-0.5">→</span>
        </a>
        <a
          href="https://github.com/oyuh/music-widget"
          class="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 font-mono-ui text-sm text-foreground transition-colors hover:bg-accent"
        >
          the source
        </a>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
        <a
          href="https://fast.jamlog.lol"
          class="group inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-mono-ui text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          go to fast.jamlog.lol
          <span class="transition-transform group-hover:translate-x-0.5">→</span>
        </a>
      </div>
    </div>

    <!-- footer -->
    <div class="border-t border-border px-6 py-4">
      <p class="font-mono-ui text-[11px] leading-relaxed text-muted-foreground">
        <span class="text-foreground">why is jamlog down?</span>
        Spotify's developer APIs got weird and the old jamlog relied on it so it was
        were restricted and the app no longer works the way it was
        meant to. Rather than duct-tape around it, everything is now at
        <a href="https://fast.jamlog.lol" class="text-foreground underline underline-offset-2"
          >fast.jamlog.lol</a
        >. Thanks for stopping by.
      </p>
      <p class="mt-3 font-mono-ui text-[11px] text-muted-foreground">
        © {year} Lawson Hart · made with ❤︎⁠
      </p>
    </div>
  </div>
</main>

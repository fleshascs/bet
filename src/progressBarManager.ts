import { MultiBar, Presets, SingleBar } from 'cli-progress';
import { Match } from './types/ggbetAPI';

interface ProgressBarManager {
  create: (slug: Match['slug'], leadingScore: number, currentMap: number) => void;
  update: (slug: Match['slug'], leadingScore: number, currentMap: number) => void;
}

export function progressBarManager(): ProgressBarManager {
  const progressbars: Record<Match['slug'], SingleBar> = {};
  const multibar = new MultiBar(
    {
      clearOnComplete: false,
      hideCursor: true,
      format: '[{bar}] {percentage}% | map: {map} | {value}/{total} | match: {slug}'
    },
    Presets.shades_grey
  );
  return {
    create: function (slug: Match['slug'], leadingScore: number, currentMap: number) {
      if (progressbars[slug]) {
        this.update(slug, leadingScore, currentMap);
        return;
      }

      progressbars[slug] = multibar.create(16, leadingScore, {
        map: currentMap,
        slug: slug
      });
    },
    update: (slug: Match['slug'], leadingScore: number, currentMap: number) => {
      progressbars[slug].update(leadingScore, { map: currentMap, slug: slug });
    }
  };
}

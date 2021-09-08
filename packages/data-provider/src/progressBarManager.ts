import { MultiBar, Presets, SingleBar } from 'cli-progress';
import { Match } from './types/ggbetAPI';

interface ProgressBarManager {
  createOrUpdate: (
    id: Match['id'],
    leadingScore: number,
    currentMap: number,
    slug: Match['slug']
  ) => void;
}

export function progressBarManager(): ProgressBarManager {
  const progressbars: Record<Match['id'], SingleBar> = {};
  const multibar = new MultiBar(
    {
      clearOnComplete: false,
      hideCursor: true,
      format: '[{bar}] {percentage}% | map: {map} | {value}/{total} | match: {slug}'
    },
    Presets.shades_grey
  );

  function create(id: Match['id'], leadingScore: number, currentMap: number, slug: Match['slug']) {
    progressbars[id] = multibar.create(16, leadingScore, {
      map: currentMap,
      slug: slug
    });
  }

  function update(id: Match['id'], leadingScore: number, currentMap: number, slug: Match['slug']) {
    progressbars[id].update(leadingScore, { map: currentMap, slug: slug });
  }

  return {
    createOrUpdate: (
      id: Match['id'],
      leadingScore: number,
      currentMap: number,
      slug: Match['slug']
    ) => {
      const fn = progressbars[id] ? update : create;
      fn(id, leadingScore, currentMap, slug);
    }
  };
}

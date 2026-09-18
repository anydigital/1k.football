export default {
  eleventyComputed: {
    totals: async ({ player_stats }) => {
      const totals = {};

      for (let s = 0; s < player_stats[0].seasons.length; s++) {
        for (let p = 0; p < player_stats.length; p++) {
          const season = player_stats[p].seasons[s];
          if (!season) continue;

          const prev = totals[p]?.[s - 1] ?? {};
          const new_totals = {};

          for (const [m, val] of Object.entries(season.metrics)) {
            new_totals[m] = (prev[m] ?? 0) + val;
          }

          if ("goals" in new_totals) {
            totals[p] ??= {};
            totals[p][s] = new_totals;
          }
        }
      }

      return totals;
    },

    s_ranks: async ({ player_stats, totals }) => {
      const s_ranks = {};

      for (let s = 0; s < player_stats[0].seasons.length; s++) {
        const player_goals = {};

        for (let p = 0; p < player_stats.length; p++) {
          if (totals[p]?.[s]) player_goals[p] = totals[p][s].goals;
        }

        // Sort ascending, rank ratio: 1 = most goals
        const sorted = Object.entries(player_goals).sort(
          ([, a], [, b]) => a - b,
        );
        s_ranks[s] ??= {};
        sorted.forEach(([p], i) => {
          s_ranks[s][p] = (i + 1) / sorted.length;
        });
      }

      return s_ranks;
    },
  },
};

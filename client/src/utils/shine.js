// Keep every loading shine in step: a negative animation-delay based on the
// wall clock puts each tile at the same point of the 1.5s sweep, so a list
// placeholder handing over to a loading card looks like one continuous tile.
export const SHINE_MS = 1500;
export const shineSync = () => ({
  "--shine-delay": `-${Date.now() % SHINE_MS}ms`,
});

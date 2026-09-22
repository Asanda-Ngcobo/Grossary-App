const sharedLocations =
  await findSharedShoppingLocations(
    latitude,
    longitude
  );

for (const location of sharedLocations) {
  const result =
    await optimizeShoppingLocation({
      items,
      location,
    });

  // collect result
}

// sort complete locations by optimized total
// cheapest becomes recommended location
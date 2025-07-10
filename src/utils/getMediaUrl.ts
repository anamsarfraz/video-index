export const getPublicImageUrl = (imagePath: string) => {
  const baseUrl = "https://videoindex.app";
  const relativePath = imagePath.replace(
    "/home/azureuser/recallstore/recall-api/../recallhq",
    ""
  );
  return `${baseUrl}/${relativePath}`;
};

export const getPublicVideoUrl = (videoPath: string) => {
  const baseUrl = "https://videoindex.app";
  if (videoPath !== undefined) {
    const relativePath = videoPath.replace(
      /^.*?\/recallhq\/temp\//, // Match everything up to "/recallhq/temp/"
      ""
    );
    return `${baseUrl}/${relativePath}`;
  }
  return baseUrl;
};

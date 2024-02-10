export const getFileExtension = (filename: string) => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
}

// const BUCKET_NAME = 'main'
// export const getStorageObjectUrl = <P extends string>(path: P) => {
//   return `${SUPABASE_URL}/storage/v1/object/authenticated/${BUCKET_NAME}/${path}` as const
// }

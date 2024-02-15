import supabase from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not get loaded");
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not get deleted");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(
    `${import.meta.env.VITE_APP_URL}`
  );

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${
        import.meta.env.VITE_APP_URL
      }/storage/v1/object/public/cabin-images/${imageName}`;

  let query = supabase.from("cabins");

  // A) CREATE CABİN
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // B) EDIT CABİNb -> Different array from insert
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query.select().single();


  if (error) {
    console.error(error);
    throw new Error("Cabin could not get created");
  }

  // 2. Upload Image

  if (hasImagePath) return data;
  
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. Delete the cabin if there was en error uploading the image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "Cabin image could not get uploaded and the cabin was not created"
    );
  }
  return data;
}
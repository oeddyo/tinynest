// app/(auth)/index.tsx
import { decode } from "base64-arraybuffer"
import * as FileSystem from "expo-file-system"
import * as ImagePicker from "expo-image-picker"
import { useLocalSearchParams } from "expo-router"
import React, { useContext, useState } from "react"
import { View, Text, Button, StyleSheet } from "react-native"

import { AuthContext } from "@/context/auth-context"
import { generateFilePath } from "@/utils/file-uploader"
import { supabase } from "@/utils/supabase"

export default function Home() {
  const { id: familyId } = useLocalSearchParams<{ id: string }>()
  const { signOut, session } = useContext(AuthContext)
  const [assets, setAssets] = useState<ImagePicker.ImagePickerAsset[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const uploadMediaItems = async () => {
    if (!session?.user.id) {
      alert("Please sign in to upload photos")
      return
    }

    setIsUploading(true)

    try {
      // upload to storage
      const uploadPromises = assets.map(async (asset) => {
        const filePath = generateFilePath(familyId, new Date())
        const fileUri = asset.uri

        // need to figure out how to deal with video
        // Use asset.base64 if it exists (provided for images when base64: true is enabled)
        // Otherwise, read the file as base64.
        let fileBase64 = asset.base64
        if (!fileBase64) {
          fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
          })
        }

        // uplod to supabase storage
        const { error: uploadError } = await supabase.storage
          .from("family_media")
          .upload(filePath, decode(fileBase64), {
            contentType: asset.type,
            upsert: false,
          })

        if (uploadError) {
          throw new Error(`Upload error: ${uploadError.message}`)
        }

        const { data: photoRecord, error: insertError } = await supabase
          .from("media_items")
          .insert({
            family_id: familyId,
            uploader_id: session.user.id,
            storage_path: filePath,
            media_type: "photo",
            // need to figure out the fields
            file_name: "dummy",
            size_bytes: 0,
            mime_type: "dummy",
          })
          .select()
          .single()

        if (insertError) {
          throw new Error(`Database error: ${insertError.message}`)
        }

        return photoRecord
      })

      const uploadedPhotos = await Promise.all(uploadPromises)
      setIsUploading(false)
      alert(`Successfully uploaded ${uploadedPhotos.length} photos!`)
    } catch (err) {
      console.log(err)
    }
  }

  const pickAssets = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.status !== "granted") {
      alert(
        "We need your permission to show the photos library. Please go to settings and grant permission."
      )
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
    })

    if (!result.canceled) {
      setAssets(result.assets)
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Sign out" onPress={signOut} />
      <View>
        <Text>Add Your First Photo</Text>
        <Button title="Add Photo" onPress={pickAssets} />
        <Text>You Have {assets.length} Selected assets</Text>
        <Button title="Upload" onPress={uploadMediaItems} />
        <Text>{`Is Uploading: ${isUploading}`}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
})

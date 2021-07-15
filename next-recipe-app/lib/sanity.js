import {
    createClient,
    createPreviewSubscriptionHook,
    createImageUrlBuilder,
    createPortableTextComponent
} from "next-sanity";


const config = {
    projectId : "srx27leg",
    dataset: "production",
    apiVersion: "v2021-06-07",
    useCdn: false,
}

export const sanityClient = createClient(config);
export const usePreviewSubscription = createPortableTextComponent(config);
export const urlFor = (source) => createImageUrlBuilder(config).image(source)
export const portableText = createPortableTextComponent({
    ...config,
    serializers:{},
})
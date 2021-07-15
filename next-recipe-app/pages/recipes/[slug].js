import { sanityClient, urlFor, usePreviewSubscription, PortableText } from "../../lib/sanity";
import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/dist/client/router";
import Image from "next/image"

const recipeQuery = `*[_type == "recipe" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    mainImage,
    ingredient[]{
      _key,
      unit,
      wholeNumber,
      fraction,
      ingredient->{
        name
      }
    },
    instructions,
    likes
  }`;

export default function OneRecipe({data}){
    const router = useRouter()
    if(router.isFallback){
        return <h1>Is loading ...</h1>
    }
    const {recipe} = data;
    const [likes, setLikes] = useState(data?.recipe?.likes)

    const addLike = async () =>{
        const res = await fetch("/api/handle-like",{
            method: "POST",
            body: JSON.stringify({_id: recipe._id}),
        }).catch((error) => console.log(error))

        const data = await res.json();
        setLikes(data.likes);
    }

    return(
        <StyledArticle>
            <h2>{recipe.name}</h2>
            <button className="likeButton" onClick={addLike}> 
                {likes} ❤
            </button>
            <main>
                <Image src={urlFor(recipe?.mainImage).url()} alt={recipe.name} />
                <div className="breakdown">
                    <ul>
                        {recipe.ingredient?.map((ingredient) =>(
                            <li key={ingredient._key}>
                                {ingredient?.wholeNumber}
                                {" "}
                                {ingredient?.fraction}
                                {" "}
                                {ingredient?.unit}
                                {" "}
                                {ingredient?.ingredient?.name}
                            </li>
                        ))}
                    </ul>
                    <PortableText blocks={recipe?.instructions}  className="instruction"/>
                </div>
            </main>
        </StyledArticle>
    )
}

const StyledArticle = styled.article`
    h2{
        font-size: 20px;
        font-weight: bold;
        color: #000;
        margin-bottom: 15px;
    }
    main{
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
    }

    img{
        border: 0.5px solid #444 ;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .breakdown{
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap:10px;
        border: 0.5px solid #444;
    }
    ul{
        list-style: none;
        padding: 25px 10px;
        border-right: 0.5px solid #444;
        li{
            margin-bottom: 15px;
        }
    }
    .instruction{
        padding: 15px;
    }

    .likeButton{
        font-size: 18px;
        display: flex;
        align-items: center;
        outline: none;
        background: none;
        border-radius: 5px;
        border: 1px solid #444;
        padding: 6px 12px;
        margin-bottom: 40px;
        cursor: pointer;
    }
`


export async function getStaticPaths(){
    const paths = await sanityClient.fetch(
        `*[_type == "recipe" && defined(slug.current)]{
            "params":{
                "slug" : slug.current
            }
        }`
    )
    return{
        paths,
        fallback:true,
    }
}

export async function getStaticProps({params}){
    const {slug} = params;
    const recipe = await sanityClient.fetch(recipeQuery, {slug})
    return {props: {data: {recipe}}}
}
import { sanityClient, urlFor, usePreviewSubscription, PortableText } from "../../lib/sanity";
import styled from "styled-components";

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
    const {recipe} = data;
    return(
        <StyledArticle>
            <h2>{recipe.name}</h2>
            <main>
                <img src={urlFor(recipe?.mainImage).url()} alt={recipe.name} />
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
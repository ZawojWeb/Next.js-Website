import Link from "next/link"
import styled from "styled-components"
import GlobalStyle from "../styles/globalStyle"

function MyApp({ Component, pageProps }) {
  return (
    <>
    <GlobalStyle></GlobalStyle>
      <StyledNav>
        <div>
          <Link href="/">
            <a>My Kitchen</a>
          </Link>
        </div>
      </StyledNav>

      <StyledMain>
        <Component {...pageProps} />
      </StyledMain>
    </>
  )
}
const StyledNav  = styled.nav`
  max-width: 80%;
  margin: 0 auto;
  padding: 12px 10px;
  font-size: 25px;

  a{
    color: rgb(75,95,75);
    display: inline-block;
    padding-top: 10px;
    text-decoration: none;
  }
`

const StyledMain = styled.main`
  max-width: 80%;
  margin: 0 auto;
  padding-top: 30px;
  padding-bottom: 80px;
`

export default MyApp

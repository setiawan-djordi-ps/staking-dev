import type { AppProps } from "next/app";
import "../styles/globals.scss";
import Navbar from "../components/Navbar/Navbar";
import AppWrapper from "../context/state";
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Footer from "../components/Navbar/Footer";

function MyApp({ Component, pageProps }: AppProps) {

    const options = {
        timeout: 3000,
        position: positions.BOTTOM_CENTER
    };    

    // console.log = console.warn = console.error = function () {};

    return (
        <Provider template={AlertTemplate} {...options}>
            <AppWrapper>
                <Navbar/>
                    <Component {...pageProps} />
                <Footer/>
            </AppWrapper>
        </Provider>        
    );
}

export default MyApp;

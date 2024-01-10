import { useRouter } from "next/dist/client/router";
import { createContext, useContext, useEffect, useState } from "react";
import { STEP } from "../constants";
import { WALLET_PARAMS } from "../pages";
import { AnchorProvider,Provider as Prov } from "@project-serum/anchor";

interface StateProps {
    web3Account: Object;
    setWeb3Account: Function;
    currentStep: String;
    setCurrentStep: Function;
    web3SolAccount: Object;
    setWeb3SolAccount: Function;
    provider: any;
    setProvider: Function;
    campaign: any;
    setCampaign: Function;
}

const AppContext = createContext<StateProps>(undefined);

const AppWrapper = ({ children }) => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(STEP.STEP_1);
    const [web3Account, setWeb3Account] = useState(router.query[WALLET_PARAMS]);
    const [web3SolAccount, setWeb3SolAccount] = useState("");
    const [provider, setProvider] = useState<any>();
    const [campaign, setCampaign ] = useState({})
    let sharedState = {
        web3Account,
        setWeb3Account,
        currentStep,
        setCurrentStep,
        web3SolAccount,
        setWeb3SolAccount,
        provider,
        setProvider,
        campaign,
        setCampaign
    };

    useEffect(() => {
        setWeb3Account(router.query[WALLET_PARAMS]);
      return () => { }
    }, [router.query]);
    

    return (
        <AppContext.Provider value={sharedState} >
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}

export default AppWrapper;
import { Link, useSearchParams } from 'react-router-dom';

function ChoiceComponent() {
    const [searchParams, setSearchParams] = useSearchParams();
    const referralCode = searchParams.get('ref')?`?ref=`+searchParams.get('ref'):``
    return (
        <>
            <header>

            <div className="section">
            <a href="https://dedacoin.co" target='_blank'>
                <img width="30px" style={{paddingRight: "13px"}} src="/logo.png" alt="" />
            </a>
            |
            <div className='logo'>
            DedaCoin
            </div> 
            </div>

            <div className="social-icons">
                    <a href="https://x.com/dedacoin_co" target="_blank" rel="noopener noreferrer"><img width="35px" style={{ border: "0.1px solid #8a8aa0", borderRadius: "10px", background: "radial-gradient(closest-side, #fff, #fff, #000)" }} src="/twitter-square-logo.svg" alt="" /></a>
                    <a href="https://t.me/DedaCoin_Official" target="_blank" rel="noopener noreferrer"><img width="34px" style={{ border: "0.1px solid #8a8aa0", borderRadius: "10px", background: "radial-gradient(closest-side, #fff, #fff, #000)" }} src="/telegram-logo2.svg" alt="" /></a>
                </div>
            </header>
            <a href={`/referral`+ referralCode}>Referral</a>
            <a href="/hedge90">Hedge90</a>
        </>
)
}

export default ChoiceComponent
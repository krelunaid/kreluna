import AdminPage from '../admin-ui';
import styles from '../booking.css?inline';
export const dynamic='force-dynamic';
export const metadata={title:'Gestione | CityBeam',robots:{index:false,follow:false},referrer:'no-referrer',alternates:{canonical:'https://www.kreluna.it/citybeam/gestione'}};
export default function Page(){return <><style dangerouslySetInnerHTML={{__html:styles}}/><AdminPage/></>;}

import { ClientPortal } from '../booking-ui';
import styles from '../booking.css?inline';
export const dynamic='force-dynamic';
export const metadata={title:'La tua pratica | CityBeam',robots:{index:false,follow:false},referrer:'no-referrer',alternates:{canonical:'https://www.kreluna.it/citybeam/pratica'}};
export default function Page(){return <><style dangerouslySetInnerHTML={{__html:styles}}/><ClientPortal/></>;}

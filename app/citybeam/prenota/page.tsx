import { RequestPage } from '../booking-ui';
import styles from '../booking.css?inline';
export const metadata={title:'Richiedi la tua campagna | CityBeam',alternates:{canonical:'https://www.kreluna.it/citybeam/prenota'}};
export default function Page(){return <><style dangerouslySetInnerHTML={{__html:styles}}/><RequestPage locale="it"/></>;}

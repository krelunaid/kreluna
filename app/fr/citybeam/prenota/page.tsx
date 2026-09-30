import { RequestPage } from '../../../citybeam/booking-ui';
import styles from '../../../citybeam/booking.css?inline';
export const metadata={title:'Demandez votre campagne | CityBeam',alternates:{canonical:'https://www.kreluna.it/fr/citybeam/prenota'}};
export default function Page(){return <><style dangerouslySetInnerHTML={{__html:styles}}/><RequestPage locale="fr"/></>;}

import { FC } from 'react'
import Markdown from 'react-markdown'

const tos = `# TÉRMINOS Y CONDICIONES DEL REGISTRO EN “PALABRAPP”

## 1. Objeto

De acuerdo con lo establecido por la Ley Orgánica 15/1999, le informamos que los datos obtenidos de este formulario serán incorporados a un fichero automatizado bajo la responsabilidad de "Palabrapp" TFM (Trabajo de final de máster) - NIF: 43566277E con la finalidad de atender sus consultas y remitirle información relacionada que pueda ser de su interés.

Mientras no nos comunique lo contrario, entenderemos que sus datos no han sido modificados, que usted se compromete a notificarnos cualquier variación y que tenemos su consentimiento para utilizarlos para las finalidades mencionadas en el punto “3.Finalidad”.

Los datos personales objeto del tratamiento serán los que constan en los formularios, y que pueden incluirse en su caso en cualquiera de las siguientes categorías: datos de carácter identificativo (nombre, apellidos, correo electrónico y elementos multimedia subidos a la aplicación).

La base legal del tratamiento es el consentimiento. Los datos de carácter personal se mantendrán mientras no sean expresamente revocados.

## 2. Responsable del tratamiento

- **Identidad**: "Palabrapp" TFM (Trabajo de final de máster) - NIF: 43566277E
- **Dirección postal**: Passeig de la Vall d'Hebron, 171, 08035 Barcelona, Spain
- **Teléfono**: 663477690
- **Correo electrónico**: marta.girabal01@alumni.upf.edu

## 3. Finalidad del tratamiento

En "Palabrapp" TFM (Trabajo de final de máster) tratamos la información que nos facilita con el fin de prestarles el servicio de la aplicación “Palabrapp”, lo que implica el tratamiento de datos necesarios para llevar a cabo esta finalidad, que, a título enunciativo, podrá incluir:

- La dirección de correo electrónico, que permite el registro en la plataforma.
- Las imágenes y gráficos online subidos a la aplicación web que forman parte del proceso de registro de palabra.
- La grabación de audio subida a la aplicación web que forman parte del proceso de registro de palabra.

De conformidad con el artículo 13 del RGPD los datos personales (correo electrónico y elementos multimedia subidos a la web app), serán tratados con el fin de ofrecer el servicio de la web app. El registro a "PalabrApp" implica, obligatoria y necesariamente, el consentimiento expreso de las personas usuarias para que sus datos personales usados sean utilizados por “PalabrApp” con el objeto de dar cumplimiento a los fines a los que se refieren los párrafos anteriores.

## 4. Duración

Los datos proporcionados se conservarán mientras exista su usuario en la aplicación, si se ha dado permiso explícito para la investigación académica en un formulario de consentimiento expreso o durante el tiempo necesario para cumplir con las obligaciones legales y atender las posibles responsabilidades que pudieran derivar del cumplimiento de la finalidad para la que los datos fueron recabados.

## 5. Cesión de datos a terceros

Los datos no se cederán a terceros salvo en los casos en que exista una obligación legal.

## 6. Derechos de las personas interesadas

Usted tiene derecho a obtener información sobre si en "Palabrapp" TFM (Trabajo de final de máster) estamos tratando sus datos personales, por lo que puede ejercer sus derechos de acceso, rectificación, supresión y portabilidad de datos y oposición y limitación a su tratamiento ante "Palabrapp" TFM (Trabajo de final de máster), Passeig de la Vall d'Hebron, 171, 08035 Barcelona, Spain o en la dirección electrónica marta.girabal01@alumni.upf.edu, identificándose suficientemente en su solicitud por medios electrónicos o, en su defecto, mediante solicitud debidamente firmada.

No obstante, si el responsable del tratamiento tuviese dudas razonables en relación con la identidad de la persona física que cursa la solicitud podrá solicitar que se facilite información adicional necesaria para confirmar su identidad. Asimismo, y especialmente si considera que no ha obtenido satisfacción plena en el ejercicio de sus derechos, podrá presentar una reclamación ante la autoridad nacional de control dirigiéndose a estos efectos a la Agencia Española de Protección de Datos, C/ Jorge Juan, 6 – 28001 Madrid.
`

export const TermsOfService: FC = () => {
  return (
    <Markdown className="lg:prose-xl prose mx-auto px-4 pb-20 pt-8">
      {tos}
    </Markdown>
  )
}

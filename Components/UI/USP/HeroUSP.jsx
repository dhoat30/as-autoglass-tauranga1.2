import Typography from "@mui/material/Typography";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styles from "./HeroUSP.module.scss";
export default function HeroUSP({
  data,
  className,
  twoColumnsGrid,
  centerAlign = false,
  inverted = false,
}) {
  if (!data) return;
  const textUspItems = Array.isArray(data?.text_usp) ? data.text_usp : [];
  return (
    <div
      className={`${className} ${styles.textUspContainer} ${
        inverted ? styles.inverted : ""
      } mt-24`}
    >
      {(textUspItems.length > 0 || !inverted)

        &&
        <div className={`${styles.textUspWrapper} ${twoColumnsGrid && styles.twoColumnsGrid} flex align-center  usp-wrapper mb-16 `} style={{ justifyContent: centerAlign ? "center" : "flex-start" }} >
          {textUspItems.map((item, index) => {

            return (
              <Typography
                variant="subtitle2"
                component="div"
                className={`flex align-center justify-center align-start mb-8 gap-4 ${styles.textUSP}`}
                key={index}

              >
                {/* <CheckCircleIcon /> */}
                {item.icon && item.icon.url && (
                  <Image src={item.icon.url} alt={item.value} width={20} height={20} />
                )}
                <span> {item.value}</span>
              </Typography>
            );
          })}
          <Typography
            variant="subtitle2"
            component="div"
            className={`flex align-center justify-center align-start mb-8 gap-4 ${styles.textUSP}`}
          >
            <span>Courtesy car available</span>
          </Typography>
          <Typography
            variant="subtitle2"
            component="div"
            className={`flex align-center justify-center align-start mb-8 gap-4 ${styles.textUSP}`}
          >
            <span>WINZ Quotes</span>
          </Typography>
        </div>
      }

      <div className={`${styles.imageUspWrapper}  flex gap-8 align-center flex-wrap`} style={{ justifyContent: centerAlign ? "center" : "flex-start" }} >
        {data.image_usp &&
          data.image_usp.map((item, index) => {
            return (

                <Image
                  key={index}
                  src={item.image.url}
                  alt={item.image.alt}
                  width={item.image.width/3.5}
                  height={item.image.height/3.5}
                />
           
            );
          })}
      </div>
    </div>
  );
}


import java.awt.*;
import java.awt.image.BufferedImage;
import java.nio.file.*;
import javax.imageio.ImageIO;
// Mechanical store-size export of the original logo and generated feature art.
class PrepareStoreAssets {
 static void resize(String source,String target,int width,int height,boolean alpha)throws Exception{
  BufferedImage original=ImageIO.read(Path.of(source).toFile());
  if(original==null)throw new IllegalStateException(source);
  BufferedImage result=new BufferedImage(width,height,alpha?BufferedImage.TYPE_INT_ARGB:BufferedImage.TYPE_INT_RGB);
  Graphics2D g=result.createGraphics();g.setColor(new Color(0x176b57));g.fillRect(0,0,width,height);
  g.setRenderingHint(RenderingHints.KEY_INTERPOLATION,RenderingHints.VALUE_INTERPOLATION_BICUBIC);
  g.setRenderingHint(RenderingHints.KEY_RENDERING,RenderingHints.VALUE_RENDER_QUALITY);
  g.drawImage(original,0,0,width,height,null);g.dispose();ImageIO.write(result,"png",Path.of(target).toFile());
 }
 public static void main(String[]args)throws Exception{
  if(args.length!=1)throw new IllegalArgumentException("Pass the original generated feature PNG path");
  Files.createDirectories(Path.of("store-listing/assets"));
  resize("www/pet_care_world_original_logo.png","store-listing/assets/app-icon-512.png",512,512,true);
  resize(args[0],"store-listing/assets/feature-1024x500.png",1024,500,false);
 }
}

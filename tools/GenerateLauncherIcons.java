import java.awt.*;
import java.awt.image.BufferedImage;
import java.nio.file.*;
import javax.imageio.ImageIO;

class GenerateLauncherIcons {
  static Path res;
  static BufferedImage original;
  static void write(String name, String text) throws Exception {
    Path p=res.resolve(name); Files.createDirectories(p.getParent()); Files.writeString(p,text);
  }
  static void png(String name,int size,double fill,boolean opaque) throws Exception {
    BufferedImage out=new BufferedImage(size,size,BufferedImage.TYPE_INT_ARGB);
    Graphics2D g=out.createGraphics();
    if(opaque){g.setColor(new Color(0x176b57));g.fillRect(0,0,size,size);}
    g.setRenderingHint(RenderingHints.KEY_INTERPOLATION,RenderingHints.VALUE_INTERPOLATION_BICUBIC);
    g.setRenderingHint(RenderingHints.KEY_RENDERING,RenderingHints.VALUE_RENDER_QUALITY);
    double scale=size*fill/Math.max(original.getWidth(),original.getHeight());
    int w=(int)Math.round(original.getWidth()*scale),h=(int)Math.round(original.getHeight()*scale);
    g.drawImage(original,(size-w)/2,(size-h)/2,w,h,null);g.dispose();
    Path p=res.resolve(name);Files.createDirectories(p.getParent());ImageIO.write(out,"png",p.toFile());
  }
  public static void main(String[] args) throws Exception {
    original=ImageIO.read(Path.of("pet_care_world_original_logo.png").toFile());
    if(original==null)throw new IllegalStateException("Original logo missing");
    res=Path.of("android/app/src/main/res");
    // Remove template artwork in every resource qualifier, including adaptive foreground vectors.
    try(var files=Files.walk(res)){
      for(Path p:files.filter(Files::isRegularFile).toList()){
        String n=p.getFileName().toString();
        if(n.equals("splash.png")||n.equals("splash.xml")||n.equals("ic_launcher_foreground.xml")||n.equals("ic_launcher_background.xml"))Files.delete(p);
      }
    }
    String[] density={"mdpi","hdpi","xhdpi","xxhdpi","xxxhdpi"};
    int[] sizes={48,72,96,144,192};
    for(int i=0;i<sizes.length;i++){
      png("mipmap-"+density[i]+"/ic_launcher.png",sizes[i],1,true);
      png("mipmap-"+density[i]+"/ic_launcher_round.png",sizes[i],1,true);
    }
    // Keep the complete supplied artwork inside Android's circular/squircle safe area.
    png("drawable-nodpi/ic_launcher_foreground.png",432,0.5,false);
    png("drawable-nodpi/brand_splash.png",512,1,true);
    String adaptive="<?xml version=\"1.0\" encoding=\"utf-8\"?><adaptive-icon xmlns:android=\"http://schemas.android.com/apk/res/android\"><background android:drawable=\"@color/petcare_icon_background\"/><foreground android:drawable=\"@drawable/ic_launcher_foreground\"/></adaptive-icon>";
    write("mipmap-anydpi-v26/ic_launcher.xml",adaptive);
    write("mipmap-anydpi-v26/ic_launcher_round.xml",adaptive);
    write("values/petcare_brand.xml","<resources><color name=\"petcare_icon_background\">#176b57</color></resources>");
    write("drawable/splash.xml","<layer-list xmlns:android=\"http://schemas.android.com/apk/res/android\"><item android:drawable=\"@color/petcare_icon_background\"/><item><bitmap android:gravity=\"center\" android:src=\"@drawable/brand_splash\"/></item></layer-list>");
    Path styles=res.resolve("values/styles.xml");
    String style=Files.readString(styles).replace("<item name=\"android:background\">@drawable/splash</item>","<item name=\"android:background\">@drawable/splash</item>\n        <item name=\"windowSplashScreenBackground\">@color/petcare_icon_background</item>\n        <item name=\"windowSplashScreenAnimatedIcon\">@mipmap/ic_launcher</item>\n        <item name=\"postSplashScreenTheme\">@style/AppTheme.NoActionBar</item>");
    Files.writeString(styles,style);
    System.out.println("Generated Android launcher and splash assets from original Pet Care World artwork.");
  }
}

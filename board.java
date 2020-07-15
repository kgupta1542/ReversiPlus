import javax.swing.*;
import java.awt.*;

public class board extends JPanel {
    private final int B_X = 500;
    private final int B_Y = 500;
    
    private final int INNER_B_X = 400;
    private final int INNER_B_Y = 400;

    private Image GAMEPIECE_B;
    private Image GAMEPIECE_W;

    public board(){
        frame();
    }

    private void frame(){
        setBackground(Color.decode("#bfdbdb"));
        setFocusable(true);
        setPreferredSize(new Dimension(B_X, B_Y));
        loadImages();

    }

    private void loadImages() {

        ImageIcon b = new ImageIcon("reversiPlusBlackPiece.png");
        GAMEPIECE_B = b.getImage();

        ImageIcon w = new ImageIcon("reversiPlusWhitePiece.png");
        GAMEPIECE_W = w.getImage();
    }

}
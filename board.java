import javax.swing.*;
import java.awt.*;

public class board extends JPanel {
    private final int B_X = 500;
    private final int B_Y = 500;
    
    public board(){
        frame();
    }

    private void frame(){
        setBackground(Color.decode("#bfdbdb"));
        setFocusable(true);

        setPreferredSize(new Dimension(B_X, B_Y));

    }

}
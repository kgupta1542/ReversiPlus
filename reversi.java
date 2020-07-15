
import java.awt.EventQueue;
import javax.swing.JFrame;

public class reversi extends JFrame{

    public reversi(){
        initGame();
    }

    private void initGame(){
        add(new board());
        setResizable(false);
        pack();
        
        setTitle("Reversi");
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }
    public static void main (String [] args){
        EventQueue.invokeLater(() -> {
            JFrame ex = new reversi();
            ex.setVisible(true);
        });
    }
}
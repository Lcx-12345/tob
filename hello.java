public class Hello {
    public static void main(String[] args) {
        String[] messages = {"Hello", "World", "Java", "Loop", "Demo"};

        for (int i = 0; i < messages.length; i++) {
            System.out.println((i + 1) + ". " + messages[i]);
        }

        System.out.println("\n逆序输出:");
        for (int i = messages.length - 1; i >= 0; i--) {
            System.out.println("- " + messages[i]);
        }
    }
}

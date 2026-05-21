fn main() {
    let messages = ["Hello", "World", "Rust", "Loop", "Demo"];

    for (i, msg) in messages.iter().enumerate() {
        println!("{}. {}", i + 1, msg);
    }

    println!("\n逆序输出:");
    for msg in messages.iter().rev() {
        println!("- {}", msg);
    }
}

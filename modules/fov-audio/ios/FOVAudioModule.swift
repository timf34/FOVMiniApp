import ExpoModulesCore

public class FOVAudioModule: Module {
  public func definition() -> ModuleDefinition {
    Name("FOVAudio")

    OnCreate {
      NSLog("[FOVAudio] OnCreate – module loaded")
    }

    // Tiny test methods so we can see the bridge working
    AsyncFunction("ping") { (msg: String) -> String in
      return "pong: \(msg)"
    }

    AsyncFunction("add") { (a: Double, b: Double) -> Double in
      return a + b
    }

    // Optional: constants (verify in debugger)
    Constants([
      "module": "FOVAudio",
      "version": "0.0.1"
    ])
  }
}

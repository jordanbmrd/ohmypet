import Foundation

enum PetSpecies: String, CaseIterable, Identifiable, Hashable {
    case dog
    case cat

    var id: String { rawValue }
    var label: String { self == .dog ? "Chien" : "Chat" }
    var symbol: String { self == .dog ? "dog.fill" : "cat.fill" }
}

/// A pet selected by the user, with the source photo as JPEG data.
struct Pet: Hashable {
    var species: PetSpecies
    var imageData: Data
}

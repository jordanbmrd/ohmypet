import SwiftUI

@MainActor
final class HomeViewModel: ObservableObject {
    @Published var species: PetSpecies = .dog
    @Published var pickedImage: UIImage?
    @Published var showPicker = false

    var hasPhoto: Bool { pickedImage != nil }

    func makePet() -> Pet? {
        guard let image = pickedImage,
              let data = ImageService.prepareForUpload(image) else { return nil }
        return Pet(species: species, imageData: data)
    }

    func reset() {
        pickedImage = nil
    }
}

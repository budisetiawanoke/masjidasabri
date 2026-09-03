import os
from PIL import Image, ImageOps, ImageDraw

SOURCE_LOGO = 'Desain Aplikasi Mobile Masjid Asabri/assets/logo-masjid-asabri.png'

def generate_all():
    print(f"Loading source logo from {SOURCE_LOGO}...")
    source = Image.open(SOURCE_LOGO).convert("RGBA")
    
    # 1. Save to public/logo.png & public/assets/logo-masjid-asabri.png
    os.makedirs('public/assets', exist_ok=True)
    source.save('public/logo.png', "PNG")
    source.save('public/assets/logo-masjid-asabri.png', "PNG")
    print("Saved public/logo.png & public/assets/logo-masjid-asabri.png")

    # 2. Android Mipmap App Icons
    icon_sizes = {
        'mipmap-mdpi': 48,
        'mipmap-hdpi': 72,
        'mipmap-xhdpi': 96,
        'mipmap-xxhdpi': 144,
        'mipmap-xxxhdpi': 192,
    }

    for folder, size in icon_sizes.items():
        dir_path = os.path.join('android/app/src/main/res', folder)
        os.makedirs(dir_path, exist_ok=True)
        
        # Square launcher icon with cream background & padded logo
        base_square = Image.new("RGBA", (size, size), (251, 247, 238, 255))
        # Resize logo maintaining aspect ratio with 10% padding
        pad = int(size * 0.1)
        logo_resized = ImageOps.contain(source, (size - pad * 2, size - pad * 2), Image.Resampling.LANCZOS)
        
        # Center logo
        offset_x = (size - logo_resized.width) // 2
        offset_y = (size - logo_resized.height) // 2
        base_square.paste(logo_resized, (offset_x, offset_y), logo_resized)
        
        base_square.save(os.path.join(dir_path, 'ic_launcher.png'), "PNG")
        
        # Foreground icon (transparent background)
        fg_icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        fg_icon.paste(logo_resized, (offset_x, offset_y), logo_resized)
        fg_icon.save(os.path.join(dir_path, 'ic_launcher_foreground.png'), "PNG")
        
        # Round icon with circular mask
        mask = Image.new("L", (size, size), 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, size, size), fill=255)
        
        round_icon = Image.new("RGBA", (size, size), (251, 247, 238, 255))
        round_icon.paste(logo_resized, (offset_x, offset_y), logo_resized)
        round_icon.putalpha(mask)
        round_icon.save(os.path.join(dir_path, 'ic_launcher_round.png'), "PNG")

    print("Updated all Android launcher & mipmap icons.")

    # 3. Android Splash Screens
    # Find all splash.png locations in android/app/src/main/res
    bg_color = (15, 61, 46, 255) # Deep Emerald #0F3D2E
    
    splash_locations = []
    for root, dirs, files in os.walk('android/app/src/main/res'):
        for f in files:
            if f == 'splash.png':
                splash_locations.append(os.path.join(root, f))
                
    for splash_path in splash_locations:
        # Inspect target splash dimension
        with Image.open(splash_path) as target:
            target_w, target_h = target.size
            
        splash_img = Image.new("RGBA", (target_w, target_h), bg_color)
        
        # Scale logo to fit ~45% of min dimension
        max_logo_dim = int(min(target_w, target_h) * 0.45)
        logo_splash = ImageOps.contain(source, (max_logo_dim, max_logo_dim), Image.Resampling.LANCZOS)
        
        pos_x = (target_w - logo_splash.width) // 2
        pos_y = (target_h - logo_splash.height) // 2
        splash_img.paste(logo_splash, (pos_x, pos_y), logo_splash)
        
        splash_img.save(splash_path, "PNG")
        print(f"Updated splash screen: {splash_path} ({target_w}x{target_h})")

if __name__ == "__main__":
    generate_all()

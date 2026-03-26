import re
import os

def get_real_case_dir(base_path, target_dir_lower):
    """Finds the actual case-sensitive directory name given a lowercase target."""
    if not os.path.exists(base_path):
        return None
    for entry in os.listdir(base_path):
        if entry.lower() == target_dir_lower:
            return entry
    return None

def main():
    base_dir = '/Users/gierad/Developer/Source/homepage/gierad.com/wp-content/themes/gratitude'
    out_file = '/Users/gierad/Developer/Source/homepage/gierad-v2/index.html'
    projects_dir = '/Users/gierad/Developer/Source/homepage/gierad-v2/projects'

    with open(f'{base_dir}/header.php', 'r') as f:
        header = f.read()
    with open(f'{base_dir}/index.php', 'r') as f:
        index = f.read()
    with open(f'{base_dir}/footer.php', 'r') as f:
        footer = f.read()

    title_start = header.find('<!--- Dynamic Title -->')
    title_end = header.find('<? endif; ?>', title_start) + len('<? endif; ?>')
    
    static_title = '''<!--- Dynamic Title -->
		<title>Dr. Gierad Laput | Apple </title>
		<meta name="Description" content="Dr. Gierad Laput is a Senior Engineering Manager at Apple.">
'''
    header = header[:title_start] + static_title + header[title_end:]

    header_logic_start = header.find('<? if (get_the_title($post->ID)=="Portfolio"): ?>')
    header_logic_end = header.find('<? endif; ?>', header_logic_start) + len('<? endif; ?>')
    
    static_header = '''
						<span class="logo"><a href="https://www.gierad.com">D<span class="doctor">r</span>. Gierad Laput <span>| <i class="fas fa-home"></i></span></a></span>
						<a href="#menu"><span>Menu</span></a>
'''
    header = header[:header_logic_start] + static_header + header[header_logic_end:]

    php_regex = r'<\?[\s\S]*?\?>'
    header = re.sub(php_regex, '', header)
    header = header.replace('<?php echo get_template_directory_uri(); ?>/assets', 'assets')
    header = header.replace('<?php echo get_template_directory_uri(); ?>', '')
    header = header.replace('<base href="/" />', '<base href="./" />')
    header = header.replace('<base href="<; echo get_template_directory_uri(); >/" />', '<base href="./" />')

    index = re.sub(php_regex, '', index)
    
    def fix_projects_url(match):
        project_name = match.group(1)
        file_name = match.group(2)
        real_dir = get_real_case_dir(projects_dir, project_name.lower())
        if real_dir:
            return f"projects/{real_dir}/{file_name}"
        return match.group(0)

    index = re.sub(r'projects/([^/]+)/([^"\'\s>]+)', fix_projects_url, index)

    index = re.sub(r'(\.jpg|\.png)\?v=\d+', r'\1', index)
    header = re.sub(r'(\.jpg|\.png|\.css)\?v=[\d\.]+', r'\1', header)

    # Use regex to strip placeholder and convert data-src to src
    index = re.sub(r'src="[^"]*images/placeholder.png"\s*', '', index)
    
    # We will just remove the lazyload class because removing lazysizes.js could break it if we don't.
    # The CSS class lazyload might set opacity:0 until lazysizes.js finishes and removes it. 
    index = index.replace('class="lazyload"', '')
    index = index.replace('data-sizes="auto"', '')
    index = index.replace('data-src=', 'src=')

    footer = re.sub(php_regex, '', footer)
    footer = footer.replace('<?php echo get_template_directory_uri(); ?>/assets', 'assets')
    footer = footer.replace('<?php echo get_template_directory_uri(); ?>', '')
    
    boundary = """
		<!-- Main Page Wrapper continued -->
    """
    
    with open(out_file, 'w') as f:
        f.write(header + boundary + index + footer)

if __name__ == '__main__':
    main()

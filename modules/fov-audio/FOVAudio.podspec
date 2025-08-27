Pod::Spec.new do |s|
	s.name         = 'FOVAudio'
	s.version      = '0.0.1'
	s.summary      = 'Minimal FOVAudio module'
	s.description  = 'A tiny Expo module used to verify autolinking & registration.'
	s.homepage     = 'https://example.invalid'
	s.license      = { :type => 'MIT' }
	s.authors      = { 'FOV' => 'dev@fov.invalid' }
	s.platforms    = { :ios => '15.1' }
	s.source       = { :path => '.' }
	s.source_files = 'ios/**/*.{h,m,mm,swift}'
	s.requires_arc = true
	s.swift_version = '5.0'
	s.module_name  = 'FOVAudio'
	s.pod_target_xcconfig = {
	  'DEFINES_MODULE' => 'YES',
	  'SWIFT_COMPILATION_MODE' => 'wholemodule'
	}
	s.dependency 'ExpoModulesCore'
end
  
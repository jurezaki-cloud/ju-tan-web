plugins { id("com.android.application") }
android { namespace = "com.jutan.dobavnica.marko"; compileSdk = 35
 defaultConfig { applicationId = "com.jutan.dobavnica.marko"; minSdk = 24; targetSdk = 35; versionCode = 1; versionName = "1.0.0" }
 buildTypes { getByName("release") { isMinifyEnabled = false } }
 compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
}

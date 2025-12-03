import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig-server.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Read the JSON file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const lessonDataPath = join(__dirname, '../data/lessons/unit-1-lesson.json');
const lessonData = JSON.parse(readFileSync(lessonDataPath, 'utf-8'));

async function uploadLessonToDatabase() {
  try {
    console.log('🚀 Starting lesson upload to database...');
    
    // Upload the lesson to the 'lessons' collection using existing db instance
    const lessonRef = doc(db, 'lessons', lessonData.id);
    
    await setDoc(lessonRef, {
      ...lessonData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✅ Lesson uploaded successfully!');
    console.log(`📚 Lesson ID: ${lessonData.id}`);
    console.log(`📝 Title: ${lessonData.title}`);
    console.log(`❓ Questions: ${lessonData.checkIns.length}`);
    console.log(`📖 Sections: ${lessonData.sections.length}`);
    console.log(`📚 Vocabulary Terms: ${lessonData.vocabulary.length}`);

  } catch (error) {
    console.error('❌ Error uploading lesson:', error);
    throw error;
  }
}

// Also upload individual vocabulary terms to a separate collection for easy reference
async function uploadVocabularyTerms() {
  try {
    console.log('📚 Uploading vocabulary terms...');
    
    for (const vocab of lessonData.vocabulary) {
      const vocabRef = doc(db, 'vocabulary', `${lessonData.id}-${vocab.term.toLowerCase().replace(/\s+/g, '-')}`);
      
      await setDoc(vocabRef, {
        ...vocab,
        lessonId: lessonData.id,
        createdAt: new Date()
      });
    }
    
    console.log('✅ Vocabulary terms uploaded successfully!');
  } catch (error) {
    console.error('❌ Error uploading vocabulary:', error);
    throw error;
  }
}

// Main upload function
async function main() {
  try {
    await uploadLessonToDatabase();
    await uploadVocabularyTerms();
    
    console.log('\n🎉 All data uploaded successfully!');
    console.log('\nNext steps:');
    console.log('1. Update your RegionDef.tsx to use the new lesson ID');
    console.log('2. Test the lesson in your application');
    console.log('3. Verify the quiz functionality works correctly');
    
  } catch (error) {
    console.error('\n💥 Upload failed:', error.message);
    process.exit(1);
  }
}

// Run the upload if this script is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export { uploadLessonToDatabase, uploadVocabularyTerms };
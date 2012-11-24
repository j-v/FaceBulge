#include "opencv2/objdetect/objdetect.hpp"
 #include "opencv2/highgui/highgui.hpp"
 #include "opencv2/imgproc/imgproc.hpp"

 #include <iostream>
 #include <stdio.h>

 using namespace std;
 using namespace cv;

 /** Function Headers */
 std::vector<Rect> detectAndDisplay( Mat frame );
 void stdoutJSONWriter (std::vector<Rect> faces);

 /** Global variables */
 String face_cascade_name = "haarcascade_frontalface_alt.xml";
 CascadeClassifier face_cascade;
 string window_name = "Capture - Face detection";
 RNG rng(12345);

 /** @function main */
 int main( int argc, const char** argv )
 {
   CvCapture* capture;
   Mat frame;
   std::vector<Rect> faces;

   //-- 1. Load the cascades
   if( !face_cascade.load( face_cascade_name ) ){ printf("--(!)Error loading\n"); return -1; };

   //-- 2. Read the video stream
    frame = imread( argv[1] );

    //-- 3. Apply the classifier to the frame
    if( !frame.empty() )
    { faces = detectAndDisplay( frame ); }
    else
    { printf(" --(!) No PICTURE found -- Break!"); return 1;}


    stdoutJSONWriter(faces);

    waitKey(0);
   return 0;
 }

/** @function detectAndDisplay */
std::vector<Rect> detectAndDisplay( Mat frame )
{
  std::vector<Rect> faces;
  Mat frame_gray;

  cvtColor( frame, frame_gray, CV_BGR2GRAY );
  equalizeHist( frame_gray, frame_gray );

  //-- Detect faces
  face_cascade.detectMultiScale( frame_gray, faces, 1.1, 2, 0|CV_HAAR_SCALE_IMAGE, Size(30, 30) );

  for( int i = 0; i < faces.size(); i++ )
  {
    Point center( faces[i].x + faces[i].width*0.5, faces[i].y + faces[i].height*0.5 );
    ellipse( frame, center, Size( faces[i].width*0.5, faces[i].height*0.5), 0, 0, 360, Scalar( 255, 0, 255 ), 4, 8, 0 );
  }
  //-- Show what you got
  imshow( window_name, frame );

  return faces;
}

void stdoutJSONWriter (std::vector<Rect> faces)
{
  int id, x, y, width, height;

  // JSON Header
  cout << "{\n"
    "\"faces\": [\n";

  // JSON element for each face
  for (int i = 0; i < faces.size(); ++i)
  {
    id = i;
    x = faces[i].x;
    y = faces[i].y;
    width = faces[i].width;
    height = faces[i].height;

    cout << "{ \"id\":\"" << id << "\" , "
    << "\"x\":\"" << x << "\" , "
    << "\"y\":\"" << y << "\" , "
    << "\"width\":\"" << width << "\" , "
    << "\"height\":\"" << height << "\" }";
    if (i+1 != faces.size()) { cout << ",";}
  }

  // JSON delimiter
  cout << "]\n}";
}
